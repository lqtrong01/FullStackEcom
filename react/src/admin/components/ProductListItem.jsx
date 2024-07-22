import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import TButton from "../components/shared/TButton";
import { formatCurrency } from "../../contexts/ContextProvider";

export default function ProductListItem({ product, onDeleteClick }) {
  return (
    <div className="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
      <img
        src={product.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+product.product_image:product.product_image}
        alt={''}
        className="w-full h-48 object-contain"
      />
      <h4 className="mt-4 text-lg font-bold">{product.name}</h4>
      <div
        dangerouslySetInnerHTML={{ __html: formatCurrency(product.product_item.price) }}
        className="overflow-hidden text-md font-semibold"
      ></div>
      <div
        dangerouslySetInnerHTML={{ __html: product.description }}
        className="overflow-hidden flex-1"
      ></div>

      <div className="flex justify-between items-center mt-3">
        <TButton to={`/admin/product/${product.id}/edit`}>
          <PencilIcon className="w-5 h-5 mr-2 " />
          Edit
        </TButton>
        <div className="flex items-center">
          <TButton href={product.product_image[0]==='i'?import.meta.env.VITE_API_BASE_URL+'/'+product.product_image:product.product_image} circle link>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 visible" />
          </TButton>

          {product.id && (
            <TButton onClick={(ev) => onDeleteClick(product.id)} circle link color="red">
              <TrashIcon className="w-5 h-5" />
            </TButton>
          )}
        </div>
      </div>
    </div>
  );
}