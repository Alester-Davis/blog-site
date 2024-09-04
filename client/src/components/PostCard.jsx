import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative border w-[300px] md:w-full  h-[300px] overflow-hidden rounded-3xl transition-all shadow-lg dark:border-none dark:bg-slate-900'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[160px] w-full object-cover group-hover:h-[120px] transition-all duration-300'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border-1 border-black text-black hover:border-black dark:text-white dark:border-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
