import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import { FaSpinner } from "react-icons/fa";
import { StarIcon } from "@heroicons/react/24/outline";
import { negate } from "lodash";
import { convertTimestampToDateTime } from "../../contexts/ContextProvider";

const RatingSummary = ({ filters, activeFilter, setActiveFilter, setSearch, rating }) => {
    const onChangeFilter = (filter) => {
        setActiveFilter(filter);
    };
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <div className="border p-4 rounded-lg mb-4 bg-pink-100">
            <h2 className="text-xl font-semibold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>
            <div className="flex items-center space-x-2">
                <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
                <span className="text-lg">trên 5</span>
            </div>
            <div className="flex items-center mt-2 mb-4">
                {[0, 1, 2, 3, 4].map((rate) => (
                    <StarIcon
                        key={rate}
                        className={classNames(
                            rating > rate ? 'text-yellow-400' : 'text-gray-400',
                            'h-5 w-5 flex-shrink-0',
                        )}
                        aria-hidden="true"
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {filters.map((filter, index) => (
                    <button
                        key={index}
                        className={`px-3 py-1 rounded border ${activeFilter === filter ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => onChangeFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                className="px-3 py-1 border rounded w-full"
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

const ReviewItem = ({ review }) => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <div className="border p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
                {review?.user_review?.user_id?.user_image && (
                    <img
                        src={import.meta.env.VITE_BASE_API_URL + '/' + review?.user_review?.user_id?.user_image}
                        alt=""
                        className="size-12 object-contain rounded-full mr-4"
                    />
                )}
                {!review?.user_review?.user_id?.user_image && (
                    <span className="flex justify-center items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    </span>
                )}
                <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                            key={rating}
                            className={classNames(
                                review?.user_review?.rating_value > rating ? 'text-yellow-400' : 'text-gray-200',
                                'h-5 w-5 flex-shrink-0',
                            )}
                            aria-hidden="true"
                        />
                    ))}
                    <p className="sr-only">{review && review?.user_review?.rating_value} out of 5 stars</p>
                </div>
            </div>
            <div className="text-sm text-gray-600 cursor-pointer">{review && review.user_review.comment}</div>
            <p>{convertTimestampToDateTime(review.updated_at)}</p>
        </div>
    );
};

const ReviewList = ({ reviews }) => {
    return (
        <div>
            {reviews.map((review, index) => (
                <ReviewItem key={index} review={review} />
            ))}
        </div>
    );
};

const infilters = [
    'Tất Cả (0)',
    '5 Sao (0)',
    '4 Sao (0)',
    '3 Sao (0)',
    '2 Sao (0)',
    '1 Sao (0)'
];

const ReviewsPage = ({ id }) => {
    const [rating, setRating] = useState(0);
    const [activeFilter, setActiveFilter] = useState(infilters[0]);
    const [reviews, setReview] = useState([]);
    const [loading, setLoading] = useState(null);
    const [loadForm, setLoadForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [selected, setSelected] = useState(postsPerPage);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(infilters);
    let pages = [];

    useEffect(() => {
        setLoading(false);
        axiosClient.get(`/review/${id}`)
            .then(({ data }) => {
                setReview(data.data);
                setFilterData(data.data);
                updateFilters(data.data);
                setLoading(true);
            })
            .catch(({ err }) => {
                setLoading(false);
            });
        axiosClient.get(`/product_item/${id}`)
            .then(({ data }) => {
                setRating(data.data.rating);
            });
    }, [loadForm]);

    useEffect(() => {
        if (activeFilter.startsWith('Tất Cả')) {
            setFilterData(reviews);
        } else {
            const filterValue = parseInt(activeFilter.split(' ')[0], 10);
            const filteredReviews = reviews.filter(review => review.user_review.rating_value === filterValue);
            setFilterData(filteredReviews);
        }
    }, [activeFilter, reviews]);

    const updateFilters = (reviews) => {

        const counts = [0, 0, 0, 0, 0];
        reviews.forEach(review => {
            if (review.user_review.rating_value >= 1 && review.user_review.rating_value <= 5) {
                counts[review.user_review.rating_value - 1]++;
            }
        });

        const newFilters = [
            `Tất Cả (${reviews.length})`,
            `5 Sao (${counts[4]})`,
            `4 Sao (${counts[3]})`,
            `3 Sao (${counts[2]})`,
            `2 Sao (${counts[1]})`,
            `1 Sao (${counts[0]})`
        ];
        setFilters(newFilters);
    };

    const onPageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    for (let i = 1; i <= Math.ceil(filterData.length / selected); i++) {
        pages.push({ label: i, active: i === currentPage }); // Setting active state based on currentPage
    }

    useEffect(() => {
        setFilterData(reviews);
        if (search === '') {
            setFilterData(reviews);
        } else {
            setFilterData(
                reviews.filter(item =>
                    item.user_review.comment.toLowerCase().includes(search.toLowerCase()) ||
                    item.id.toString().toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, reviews]);

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentPosts = filterData.slice(firstPostIndex, lastPostIndex);

    return (
        <div className="container mx-auto p-4">
            <RatingSummary
                filters={filters}
                setSearch={setSearch}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                rating={rating}
            />
            <ReviewList reviews={currentPosts} />
            <div className="bottom-4 flex items-center justify-center bg-transparent px-4 py-3 sm:px-6 mt-4">
                <nav className="inline-flex -space-x-px rounded-md shadow-md" aria-label="Pagination">
                    {pages.map((page, index) => (
                        <a
                            href="#"
                            onClick={(ev) => {
                                ev.preventDefault();
                                onPageClick(page.label);
                            }}
                            key={index}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 
                            text-gray-700 hover:bg-gray-50 ${index === 0 ? 'rounded-l-md' : ''} ${index === pages.length - 1 ? 'rounded-r-md' : ''}
                            ${page.active ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : ''}`}
                        >
                            {page.label}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default ReviewsPage;
