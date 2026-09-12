import { POSTS } from '../home/data';
import { MY_POSTS } from '../my-posts/data';
import { SHOP_POSTS } from '../shop/data';
import { shopPostToFeedPost } from '../shop/postDetails';

export function findPost(id: string | undefined) {
  const post = POSTS.find((post) => post.id === id) ?? MY_POSTS.find((post) => post.id === id);
  if (post) return post;
  const shopPost = SHOP_POSTS.find((post) => post.id === id);
  return shopPost ? shopPostToFeedPost(shopPost) : undefined;
}
