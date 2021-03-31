import React, { useEffect } from "react";

import { GetStaticProps } from "next";

import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import Link from "next/link";
import Head from "next/head";

import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();
  
  //redirecionar o usuario para post depois de logado
  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])
  
  return (
    <>
       <Head>
        <title>{post.title} | ig.news </title>
      </Head>
      
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content}}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publicat', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }
}