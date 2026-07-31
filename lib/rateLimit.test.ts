import { beforeEach, describe, expect, it, vi } from "vitest"

const sqlMock = vi.fn()

vi.mock("./db/client", () => ({
  sql: (...args: unknown[]) => sqlMock(...args),
}))

describe("checkRateLimit", () => {
  beforeEach(() => {
    sqlMock.mockReset()
  })

  it("allows the request when the count is within the limit", async () => {
    sqlMock
      .mockResolvedValueOnce(undefined) // insert
      .mockResolvedValueOnce([{ count: "3" }]) // count

    const { checkRateLimit } = await import("./rateLimit")
    const allowed = await checkRateLimit("route:1.2.3.4", {
      windowSeconds: 60,
      max: 5,
    })

    expect(allowed).toBe(true)
  })

  it("blocks the request when the count exceeds the limit", async () => {
    sqlMock
      .mockResolvedValueOnce(undefined) // insert
      .mockResolvedValueOnce([{ count: "21" }]) // count

    const { checkRateLimit } = await import("./rateLimit")
    const allowed = await checkRateLimit("route:1.2.3.4", {
      windowSeconds: 60,
      max: 20,
    })

    expect(allowed).toBe(false)
  })

  it("scopes the insert and count to the given key", async () => {
    sqlMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce([{ count: "1" }])

    const { checkRateLimit } = await import("./rateLimit")
    await checkRateLimit("route:9.9.9.9", { windowSeconds: 30, max: 10 })

    const insertValues = sqlMock.mock.calls[0].slice(1)
    const countValues = sqlMock.mock.calls[1].slice(1)
    expect(insertValues).toContain("route:9.9.9.9")
    expect(countValues).toContain("route:9.9.9.9")
  })
})
