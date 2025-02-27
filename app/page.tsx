import Redis from 'ioredis';
import Link from 'next/link';

import { type Post } from '@/types/post';

const REDIS_PREFIX = `posts:user`;

const redis = new Redis(process.env.KV_URL!, {
	tls: {
		rejectUnauthorized: false,
	},
});

async function fetchPostsByUserId(userId: number): Promise<Post[]> {
	const redisKey = `${REDIS_PREFIX}:${userId}`;

	const cached = await redis.get(`${REDIS_PREFIX}:${userId}`);
	if (cached) {
		return JSON.parse(cached) as Post[];
	} else {
		const res = await fetch(
			`https://jsonplaceholder.typicode.com/posts?userId=${userId}`
		);

		if (!res.ok) {
			throw new Error(`Failed to fetch posts for user ${userId}`);
		}

		const posts = (await res.json()) as Post[];

		await redis.set(redisKey, JSON.stringify(posts));

		return posts;
	}
}

export default async function Home() {
	let allPosts: Post[] = [];

	// For example, fetch posts for users 1, 2, and 3
	const userIds = [1, 2, 3];
	const promises = userIds.map((id) => fetchPostsByUserId(id));

	const results = await Promise.allSettled(promises);

	// Combine only the fulfilled results into allPosts
	for (const result of results) {
		if (result.status === 'fulfilled') {
			allPosts = allPosts.concat(result.value);
		} else {
			console.error('Failed fetching user posts:', result.reason);
		}
	}
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
					{allPosts.map((post) => (
						<li
							className="p-4 border rounded-lg hover:bg-gray-900 transition"
							key={post.id}
						>
							<Link
								className="text-xl font-medium text-blue-400 hover:underline"
								href={`/posts/${post.id}`}
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
