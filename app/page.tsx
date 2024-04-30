import getPosts from "@/server/actions/get-posts";
import createPost from "@/server/actions/create-post";
import Image from "next/image";
import PostButton from "./components/post-button";
import styles from "./app.module.css";
import { Button } from "@/components/ui/button";
export default async function Home() {
  const { error, success } = await getPosts();
  if (error) {
    throw new Error(error);
  }
  if (success)
    return (
      <main>
        <h1 className={styles.title}>Posts</h1>
        {success?.map((post) => (
          <div>
            <h2>
              {post.id} | {post.title}
            </h2>
          </div>
        ))}
        <Button variant={"default"}>Try</Button>
        <form action={createPost}>
          <input type="text" name="title" placeholder="title" required/>
          <PostButton />
        </form>
      </main>
    );
}
