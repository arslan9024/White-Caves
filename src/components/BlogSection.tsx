import React, { FC, useState } from 'react';
import {
  BlogSectionContainer,
  BlogContainer,
  BlogHeader,
  FeaturedPosts,
  FeaturedPost,
  FeaturedImage,
  PostCategory,
  FeaturedContent,
  PostMeta,
  PostAuthor,
  ReadMoreBtn,
  BlogFilters,
  FilterBtn,
  BlogGrid,
  BlogCard,
  BlogCardImage,
  BlogCardContent,
  BlogCardCategory,
  BlogCardTitle,
  BlogCardMeta,
  LoadMoreBtn,
  CardFooter,
  ReadMoreLink,
  LoadMoreContainer
} from './BlogSection.styles';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
}

interface BlogSectionProps {}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Dubai Real Estate Market Trends 2025: What Buyers Need to Know",
    excerpt: "The Dubai property market continues to show remarkable resilience and growth. Here's our comprehensive analysis of current trends and future predictions for investors.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Market Analysis",
    author: "Ahmed Hassan",
    date: "December 10, 2025",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Complete Guide to Buying Property in Palm Jumeirah",
    excerpt: "Everything you need to know about purchasing your dream villa or apartment on Dubai's iconic Palm Jumeirah island.",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Buying Guide",
    author: "Sarah Al-Maktoum",
    date: "December 5, 2025",
    readTime: "12 min read",
    featured: true
  },
  {
    id: 3,
    title: "Understanding Dubai's Golden Visa Through Property Investment",
    excerpt: "Learn how property investment of AED 2 million or more can qualify you for the UAE's prestigious Golden Visa program.",
    image: "https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Investment",
    author: "Mohammed Rashid",
    date: "November 28, 2025",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 4,
    title: "Top 10 Family-Friendly Communities in Dubai",
    excerpt: "Discover the best residential areas for families with children, featuring excellent schools, parks, and amenities.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Lifestyle",
    author: "Fatima Khan",
    date: "November 20, 2025",
    readTime: "10 min read",
    featured: false
  },
  {
    id: 5,
    title: "EJARI Registration: Step-by-Step Guide for Tenants",
    excerpt: "A comprehensive walkthrough of the EJARI registration process, required documents, and common pitfalls to avoid.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Legal",
    author: "Omar Khalid",
    date: "November 15, 2025",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 6,
    title: "Rental Yields in Dubai: Best Areas for Investment Returns",
    excerpt: "Analysis of rental yields across Dubai's top neighborhoods to help investors maximize their ROI.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Investment",
    author: "Ahmed Hassan",
    date: "November 10, 2025",
    readTime: "9 min read",
    featured: false
  }
];

const categories = ["All", "Market Analysis", "Buying Guide", "Investment", "Lifestyle", "Legal"];

const BlogSection: FC<BlogSectionProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const loadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  return (
    <BlogSectionContainer id="blog">
      <BlogContainer>
        <BlogHeader>
          <h2>Real Estate Insights</h2>
          <p>Stay informed with the latest news, guides, and market analysis from Dubai's property experts</p>
        </BlogHeader>

        <FeaturedPosts>
          {featuredPosts.map(post => (
            <FeaturedPost key={post.id}>
              <FeaturedImage $bgImage={post.image}>
                <PostCategory>{post.category}</PostCategory>
              </FeaturedImage>
              <FeaturedContent>
                <PostMeta>
                  <PostAuthor>{post.author}</PostAuthor>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </PostMeta>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <ReadMoreBtn>Read Article →</ReadMoreBtn>
              </FeaturedContent>
            </FeaturedPost>
          ))}
        </FeaturedPosts>

        <BlogFilters>
          {categories.map(category => (
            <FilterBtn
              key={category}
              $isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterBtn>
          ))}
        </BlogFilters>

        <BlogGrid>
          {regularPosts.slice(0, visiblePosts).map(post => (
            <BlogCard key={post.id}>
              <BlogCardImage $bgImage={post.image}>
                <BlogCardCategory>{post.category}</BlogCardCategory>
              </BlogCardImage>
              <BlogCardContent>
                <BlogCardMeta>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </BlogCardMeta>
                <BlogCardTitle>{post.title}</BlogCardTitle>
                <p>{post.excerpt}</p>
                <CardFooter>
                  <PostAuthor>By {post.author}</PostAuthor>
                  <ReadMoreLink href="#">Read More →</ReadMoreLink>
                </CardFooter>
              </BlogCardContent>
            </BlogCard>
          ))}
        </BlogGrid>

        {regularPosts.length > visiblePosts && (
          <LoadMoreContainer>
            <LoadMoreBtn onClick={loadMore}>
              Load More Articles
            </LoadMoreBtn>
          </LoadMoreContainer>
        )}
      </BlogContainer>
    </BlogSectionContainer>
  );
};

export default BlogSection;
