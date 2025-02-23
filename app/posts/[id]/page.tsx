import {type Post } from '@/types/post';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
	const res = await fetch(
		'https://jsonplaceholder.typicode.com/posts?_limit=5'
	);
	const posts: Post[] = await res.json();

	return posts.map((post) => ({ id: post.id.toString() }));
}

export default async function Post({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;

	if (!resolvedParams?.id) {
		return notFound();
	}

	const postId = resolvedParams.id;
	const res = await fetch(
		`https://jsonplaceholder.typicode.com/posts/${postId}`,
		{
			next: { revalidate: 10 },
		}
	);

	if (!res.ok) {
		return notFound();
	}

	const post: Post = await res.json();

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
			<div className="max-w-2xl w-full p-6 border rounded-lg shadow-lg bg-gray-900">
				<h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
				<p className="text-lg leading-relaxed text-gray-300">{post.body}</p>
			</div>
		</main>
	);
}
