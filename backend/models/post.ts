export interface Post {
  id?: number;
  title: string;
  text: string;
  user_id: number;
  score: number;
  timestamp: number
}

export interface UserPost extends Post {
  user: string;
  country: string;
}
