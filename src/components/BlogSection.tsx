import React, { FC, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { HomepageProperty, LocationTrend, MarketStats } from '../store/slices/homepageSlice';
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
  LoadMoreContainer,
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
  link: string;
}

interface BlogSectionProps {
  marketStats?: MarketStats;
  featuredProperties?: HomepageProperty[];
  locationTrends?: LocationTrend[];
}

const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Dubai Real Estate Market Trends 2026: What Buyers Need to Know',
    excerpt:
      "The Dubai property market continues to show remarkable resilience and growth. Here's our comprehensive analysis of current trends and future predictions for investors.",
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Market Analysis',
    author: 'Ahmed Hassan',
    date: 'April 10, 2026',
    readTime: '8 min read',
    featured: true,
    link: '/market',
  },
  {
    id: 2,
    title: 'Complete Guide to Buying Property in Palm Jumeirah',
    excerpt:
      "Everything you need to know about purchasing your dream villa or apartment on Dubai's iconic Palm Jumeirah island.",
    image:
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Buying Guide',
    author: 'Sarah Al-Maktoum',
    date: 'April 5, 2026',
    readTime: '12 min read',
    featured: true,
    link: '/properties?location=Palm%20Jumeirah',
  },
  {
    id: 3,
    title: "Understanding Dubai's Golden Visa Through Property Investment",
    excerpt:
      "Learn how property investment of AED 2 million or more can qualify you for the UAE's prestigious Golden Visa program.",
    image:
      'https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Investment',
    author: 'Mohammed Rashid',
    date: 'March 28, 2026',
    readTime: '6 min read',
    featured: false,
    link: '/market',
  },
  {
    id: 4,
    title: 'Top 10 Family-Friendly Communities in Dubai',
    excerpt:
      'Discover the best residential areas for families with children, featuring excellent schools, parks, and amenities.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Lifestyle',
    author: 'Fatima Khan',
    date: 'March 20, 2026',
    readTime: '10 min read',
    featured: false,
    link: '/properties',
  },
  {
    id: 5,
    title: 'EJARI Registration: Step-by-Step Guide for Tenants',
    excerpt:
      'A comprehensive walkthrough of the EJARI registration process, required documents, and common pitfalls to avoid.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Legal',
    author: 'Omar Khalid',
    date: 'March 15, 2026',
    readTime: '7 min read',
    featured: false,
    link: '/services',
  },
  {
    id: 6,
    title: 'Rental Yields in Dubai: Best Areas for Investment Returns',
    excerpt:
      "Analysis of rental yields across Dubai's top neighborhoods to help investors maximize their ROI.",
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Investment',
    author: 'Ahmed Hassan',
    date: 'March 10, 2026',
    readTime: '9 min read',
    featured: false,
    link: '/market',
  },
];

function buildDynamicPosts(
  marketStats?: MarketStats,
  featuredProperties: HomepageProperty[] = [],
  locationTrends: LocationTrend[] = []
): BlogPost[] {
  const dynamicPosts: BlogPost[] = [];
  const leadingTrend = [...locationTrends].sort((a, b) => b.trendPercent - a.trendPercent)[0];
  const leadProperty = featuredProperties[0];

  if (leadingTrend) {
    dynamicPosts.push({
      id: 9001,
      title: `${leadingTrend.name} Property Trend: ${leadingTrend.trendPercent}% Momentum in Dubai Luxury Demand`,
      excerpt: `Our live homepage market feed shows ${leadingTrend.propertyCount} active opportunities in ${leadingTrend.name}, with average pricing around AED ${(leadingTrend.avgPrice / 1_000_000).toFixed(1)}M and ${leadingTrend.trendPercent}% trend momentum.`,
      image:
        leadProperty?.images?.[0] ||
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Market Analysis',
      author: 'White Caves Research Desk',
      date: 'Live market update',
      readTime: '4 min read',
      featured: true,
      link: '/market',
    });
  }

  if (leadProperty) {
    dynamicPosts.push({
      id: 9002,
      title: `Inside ${leadProperty.location}: What Buyers Can Learn from ${leadProperty.title}`,
      excerpt: `This ${leadProperty.type.toLowerCase()} spotlight breaks down pricing, layout expectations, and amenity demand for buyers comparing premium opportunities in ${leadProperty.location}.`,
      image:
        leadProperty.images?.[0] ||
        'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Buying Guide',
      author: 'White Caves Editorial',
      date: 'Live inventory insight',
      readTime: '5 min read',
      featured: true,
      link: `/property/${leadProperty.id}`,
    });
  }

  if (marketStats) {
    dynamicPosts.push({
      id: 9003,
      title: `Dubai Luxury Inventory Snapshot: ${marketStats.availableProperties} Available Listings Across ${marketStats.totalProperties} Properties`,
      excerpt: `Track White Caves' live homepage inventory mix, active agent coverage, and average pricing to understand where Dubai's premium market is moving this week.`,
      image:
        leadProperty?.images?.[0] ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Investment',
      author: 'White Caves Data Team',
      date: 'Live portfolio snapshot',
      readTime: '3 min read',
      featured: false,
      link: '/market',
    });
  }

  return dynamicPosts;
}

const BlogSection: FC<BlogSectionProps> = ({
  marketStats,
  featuredProperties = [],
  locationTrends = [],
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visiblePosts, setVisiblePosts] = useState(6);

  const blogPosts = useMemo(() => {
    const dynamicPosts = buildDynamicPosts(marketStats, featuredProperties, locationTrends);
    return [...dynamicPosts, ...STATIC_BLOG_POSTS];
  }, [marketStats, featuredProperties, locationTrends]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))],
    [blogPosts]
  );

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2);
  const featuredIds = new Set(featuredPosts.map(post => post.id));
  const regularPosts = filteredPosts.filter(post => !featuredIds.has(post.id));

  const loadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  return (
    <BlogSectionContainer id="blog">
      <BlogContainer>
        <BlogHeader>
          <h2>Real Estate Insights</h2>
          <p>
            Stay informed with the latest news, guides, and market analysis from Dubai&apos;s
            property experts
          </p>
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
                <ReadMoreBtn type="button" onClick={() => navigate(post.link)}>
                  Read Article →
                </ReadMoreBtn>
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
                  <ReadMoreLink as={Link} to={post.link}>
                    Read More →
                  </ReadMoreLink>
                </CardFooter>
              </BlogCardContent>
            </BlogCard>
          ))}
        </BlogGrid>

        {regularPosts.length > visiblePosts && (
          <LoadMoreContainer>
            <LoadMoreBtn onClick={loadMore}>Load More Articles</LoadMoreBtn>
          </LoadMoreContainer>
        )}
      </BlogContainer>
    </BlogSectionContainer>
  );
};

export default BlogSection;
