import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/validURLConverte'

const AllCategories = () => {
    const categoryData = useSelector(state => state.product.allcategory)
    const subCategoryData = useSelector(state => state.product.allsubCategory)

    return (
        <section className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">All Categories</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {categoryData?.map((category) => {
                        const relatedSubCategories = subCategoryData?.filter(sub =>
                            sub.category.some(c => (c._id || c) === category._id)
                        )

                        return (
                            <div key={category._id} className="bg-gray-50 rounded-xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <Link
                                    to={`/${valideURLConvert(category.name)}-${category._id}`}
                                    className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-3 md:mb-4 group text-center md:text-left"
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg p-1 md:p-2 flex items-center justify-center border border-gray-100 group-hover:border-green-500 transition-colors">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-sm md:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                                        {category.name}
                                    </h3>
                                </Link>

                                <div className="space-y-1 md:space-y-2 flex-1">
                                    {relatedSubCategories?.length > 0 ? (
                                        relatedSubCategories.map((sub) => (
                                            <Link
                                                key={sub._id}
                                                to={`/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(sub.name)}-${sub._id}`}
                                                className="block text-[11px] md:text-sm text-gray-600 hover:text-green-600 hover:translate-x-1 transition-all"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-[10px] md:text-xs text-gray-400 italic">No subcategories</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default AllCategories
