import { beforeEach, describe, expect, it, vi } from "vitest"

const sqlMock = vi.fn()

vi.mock("./client", () => ({
  sql: (...args: unknown[]) => sqlMock(...args),
}))

describe("getDailyGenerationCount", () => {
  beforeEach(() => {
    sqlMock.mockReset()
  })

  it("coerces the count to a number", async () => {
    sqlMock.mockResolvedValueOnce([{ count: "3" }])

    const { getDailyGenerationCount } = await import("./generations")
    const count = await getDailyGenerationCount("user-1")

    expect(count).toBe(3)
  })

  it("falls back to 0 when the count is missing or not a number", async () => {
    sqlMock.mockResolvedValueOnce([{ count: null }])

    const { getDailyGenerationCount } = await import("./generations")
    const count = await getDailyGenerationCount("user-1")

    expect(count).toBe(0)
  })

  it("scopes the query to today's generations for the given user", async () => {
    sqlMock.mockResolvedValueOnce([{ count: "0" }])

    const { getDailyGenerationCount } = await import("./generations")
    await getDailyGenerationCount("user-42")

    const [, ...values] = sqlMock.mock.calls[0]
    expect(values).toContain("user-42")
  })
})

describe("logGeneration", () => {
  beforeEach(() => {
    sqlMock.mockReset()
  })

  it("inserts a generation row for the given user", async () => {
    sqlMock.mockResolvedValueOnce(undefined)

    const { logGeneration } = await import("./generations")
    await logGeneration("user-7")

    const [, ...values] = sqlMock.mock.calls[0]
    expect(values).toContain("user-7")
  })
})
