import { useEffect, useRef, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import axiosClient from '../../axios'
import Spinner from '../../assets/Spinner.png'
import { useStateContext } from '../../contexts/ContextProvider'
import ReviewsPage from './RatingReviewProduct'

const product = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Men', href: '#' },
    { id: 2, name: 'SmartPhone', href: '#' },
  ],
  images: [
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: '64GB', inStock: true },
    { name: '128GB', inStock: true },
    { name: '256GB', inStock: false },
    { name: '512GB', inStock: true },
    { name: '1TB', inStock: true },
    { name: '1.5TB', inStock: false },
    { name: '2TB', inStock: false },
    { name: '3TB', inStock: false },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ProductOverview = () => {
  const { addtocart } = useOutletContext()
  const { currentUser } = useStateContext()
  const [loading, setLoading] = useState(null)
  const { id } = useParams()
  const scrollToTopRef = useRef(null);
  const [product1, setProduct] = useState({})
  const [product_item, setProductItem] = useState({})
  const [category, setCategory] = useState({})
  const [color, setColor] = useState([])
  const [sizes, setSize] = useState([])
  const [storage, setStorage] = useState([])
  const [review, setReview] = useState([])

  const formatCurrency = (money) => {
    let config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
    return new Intl.NumberFormat('vi-VN', config).format(money);
  }

  useEffect(() => {
    setLoading(false)
    axiosClient.get(`/product/${id}`)
      .then(({ data }) => {
        setProduct(data.data)
        setProductItem(data.data.product_item)
        setCategory(data.data.category)
        setColor(data.colors)
        setSize(data.sizes)
        setStorage(data.storages)
        setLoading(true)
      }).catch(({ err }) => {
        setLoading(false)
      })
  }, [])
  useEffect(() => {
    setLoading(false);
    axiosClient.get(`/review/${id}`)
      .then(({ data }) => {
        setReview(data.data);
        setLoading(true);
      })
      .catch(({ err }) => {
        setLoading(false);
      });
  }, []);

  const onSubmit = (product) => {
    const cart = {
      cart_id: currentUser.id,
      product_item_id: product.id,
      qty: 1,
      product_image: product.product_image
    }
    addtocart(product)
  }
  const scrollToDiv = () => {
    if (scrollToTopRef.current) {
      scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [selectedColor, setSelectedColor] = useState()
  const [selectedSize, setSelectedSize] = useState()
  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {product1 && (
              <>
                <li key={product1.id}>
                  <div className="flex items-center">
                    <Link to={'/home'} className="mr-2 text-sm font-medium text-gray-900">
                      Home
                    </Link>
                    <svg
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>
                <li key={product1.id}>
                  <div className="flex items-center">
                    <Link to={'/shop'} className="mr-2 text-sm font-medium text-gray-900">
                      {category.category_name}
                    </Link>
                    <svg
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>
              </>
            )}
            <li className="text-sm">
              <a aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product1.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}


        {/* Product info */}
        {!loading && <div className='w-full justify-center items-center flex'><img className='animate-spin size-10' src={Spinner} alt="" /></div>}
        {loading && <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <div className="aspect-h-3 aspect-w-4 lg:aspect-h-2 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg object-contain">
              <img
                src={product1.product_image[0] === 'i' ? import.meta.env.VITE_API_BASE_URL + '/' + product1.product_image : product1.product_image}
                alt={product.images[3].alt}
                className=" w-1/2 object-contain object-center mx-auto"
              />
            </div>

          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product1.name}</h1>
            <h2 className=" text-black">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">{(formatCurrency(product_item.price))} </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product_item.rating > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product_item.rating} out of 5 stars</p>
                <a onClick={() => scrollToDiv()} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  {review.length} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
              {/* Colors */}
              {/* <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center space-x-3">
                    {color.length>0 && color.map((color) => (
                      <Radio
                        key={color.name}
                        value={color}
                        aria-label={color.name}
                        className={({ focus, checked }) =>
                          classNames(
                            color.selectedClass,
                            focus && checked ? 'ring ring-offset-1' : '',
                            !focus && checked ? 'ring-2' : '',
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                          )
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.class,
                            'h-8 w-8 rounded-full border border-black border-opacity-10',
                          )}
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div> */}

              {/* Sizes */}
              {/* <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  
                </div>

                <fieldset aria-label="Choose a size" className="mt-4">
                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                  >
                    {sizes.length > 0 && sizes.map((size) => (
                      <Radio
                        key={size.name}
                        value={size}
                        disabled={!size.inStock}
                        className={({ focus }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            focus ? 'ring-2 ring-indigo-500' : '',
                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                          )
                        }
                      >
                        {({ checked, focus }) => (
                          <>
                            <span>{size.name}</span>
                            {size.inStock ? (
                              <span
                                className={classNames(
                                  checked ? 'border-indigo-500' : 'border-transparent',
                                  focus ? 'border' : 'border-2',
                                  'pointer-events-none absolute -inset-px rounded-md',
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                              >
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                  viewBox="0 0 100 100"
                                  preserveAspectRatio="none"
                                  stroke="currentColor"
                                >
                                  <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </Radio>
                    ))}
                    {storage.length > 0 && storage.map((size) => (
                      <Radio
                        key={size.name}
                        value={size}
                        disabled={!size.inStock}
                        className={({ focus }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            focus ? 'ring-2 ring-indigo-500' : '',
                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                          )
                        }
                      >
                        {({ checked, focus }) => (
                          <>
                            <span>{size.name}</span>
                            {size.inStock ? (
                              <span
                                className={classNames(
                                  checked ? 'border-indigo-500' : 'border-transparent',
                                  focus ? 'border' : 'border-2',
                                  'pointer-events-none absolute -inset-px rounded-md',
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                              >
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                  viewBox="0 0 100 100"
                                  preserveAspectRatio="none"
                                  stroke="currentColor"
                                >
                                  <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div> */}

              <button
                onClick={() => onSubmit(product1)}
                type="button"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
              {/* <button
                onClick={(e) => { }}
                className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-amber-500 px-8 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Buy Now
              </button> */}
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product1.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>}
      </div>
      <div ref={scrollToTopRef}></div>
      <ReviewsPage id={id} />
    </div>
  )
}

export default ProductOverview