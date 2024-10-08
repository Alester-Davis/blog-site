import { Button, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-post?slug=${postSlug}`);
        const data = await res.json();
        console.log(data)
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.result[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/get-post?limit=3`);
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setRecentPosts(data.result);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  useEffect(()=>{
    console.log(recentPosts)
  },[])
  if (loading) {
    return (
      <div className="w-full h-full p-3 flex justify-center items-center">
        <Spinner color="primary" labelColor="primary" />
      </div>
    );
  }
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className='mt-10 font-serif'>
        <Link to={"/post"}> {"< "}Back to blogs page</Link>
      </div>
      <h1 className='text-3xl p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
        <img
          src={post && post.image}
          alt={post && post.title}
          className='mt-10 p-3 max-h-[500px] w-full object-cover'
        />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <CommentSection postId={post._id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5 font-semibold mb-7'>Recent articles</h1>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-[90vw] items-center justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}