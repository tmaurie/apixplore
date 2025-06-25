export interface Idea {
  id: string
  api_name: string
  api_link?: URL
  description?: string
  generated_idea: {
    title: string
    description: string
  }
  created_at: string
  likeCount?: number
  likedByUser?: boolean
  is_public: boolean
}
