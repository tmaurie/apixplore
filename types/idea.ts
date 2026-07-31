export interface Idea {
  id: string
  api_name: string
  api_link?: string | null
  description?: string
  generated_idea: {
    title: string
    description: string
  }
  created_at: string
  likeCount?: number
  likedByUser?: boolean
  is_public: boolean
  author_id?: string
  author_name?: string | null
  author_github_username?: string | null
}
