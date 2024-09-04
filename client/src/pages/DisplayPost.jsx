import { Pagination, Spinner, Input } from "@nextui-org/react";
import { useEffect, useState, useCallback } from "react";
import PostCard from "../components/PostCard";
import { SearchIcon } from "../components/searchIcon";
import { useSelector } from "react-redux";

export default function DisplayPost() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [totalPost, setTotalPost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);
  const {currentUser} = useSelector((state)=>state.user)
  if(currentUser == null){
    return(
      <div className="w-[100vw] h-[80vh] flex items-center justify-center">
        <div className="flex justify-center items-center">
          <p>please login in first to view my blogs</p>
        </div>
      </div>
    )
  }
  const updatePostsPerPage = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) setPostsPerPage(9);
    else if (width >= 900) setPostsPerPage(6);
    else setPostsPerPage(4);
  }, []);

  const fetchPosts = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const result = await fetch(
        `/api/post/get-post?startIndex=${(page - 1) * postsPerPage}&limit=${postsPerPage}${search ? `&searchTerm=${search}` : ""}`
      );
      const data = await result.json();
      if (result.ok) {
        setPosts(data.result);
        setTotalPost(data.totalDoc);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [postsPerPage]);

  useEffect(() => {
    updatePostsPerPage();
    window.addEventListener("resize", updatePostsPerPage);
    return () => window.removeEventListener("resize", updatePostsPerPage);
  }, [updatePostsPerPage]);

  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [fetchPosts, currentPage, searchTerm]);

  if (error) 
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error loading posts</p>
      </div>
    );

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="mt-8 mb-14 w-full">
        <Input
          isClearable
          radius="lg"
          className="flex justify-center items-center"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              "border-none",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
              "w-[60vw]",
            ],
          }}
          placeholder="Type to search"
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-[100vw] flex flex-col items-center">
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          )}
          {!loading && (
            <>
              {posts.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[90vw] items-center justify-center">
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                  <div className="w-full flex items-center justify-center mt-10">
                    <Pagination
                      total={Math.ceil(totalPost / postsPerPage)}
                      page={currentPage}
                      onChange={setCurrentPage}
                      classNames={{
                        wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
                        item: "w-8 h-8 text-small rounded-none bg-transparent",
                        cursor: "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center">No posts found</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
