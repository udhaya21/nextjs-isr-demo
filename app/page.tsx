import { Post } from '@/types/post';
import Link from 'next/link';

export const revalidate = 10; // Revalidate everything together every 10 seconds

async function fetchPosts(userId: number) {
	const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
	return res.json();
}

export default async function Home() {
	// waterfall fetch
	const posts1: Post[] = await fetchPosts(1);
	const posts2: Post[] = await fetchPosts(2);
	const posts3: Post[] = await fetchPosts(3);
	const posts = [...posts1, ...posts2, ...posts3];

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
			<div className="max-w-2xl w-full">
				<h1 className="text-4xl font-bold mb-4 text-center">
					Welcome to ISR Blog
				</h1>
				<p className="text-lg text-center mb-6">
					This is a sample blog using Incremental Static Regeneration (ISR).
				</p>
				<div className="border-b border-gray-700 mb-6"></div>
				<h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
				<ul className="space-y-4">
					{posts.map((post) => (
						<li
							key={post.id}
							className="p-4 border rounded-lg hover:bg-gray-900 transition"
						>
							<Link
								href={`/posts/${post.id}`}
								className="text-xl font-medium text-blue-400 hover:underline"
							>
								{post.title}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
