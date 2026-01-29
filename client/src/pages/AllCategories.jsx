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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryData?.map((category) => {
                        const relatedSubCategories = subCategoryData?.filter(sub =>
                            sub.category.some(c => c._id === category._id)
                        )

                        return (
                            <div key={category._id} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <Link
                                    to={`/${valideURLConvert(category.name)}-${category._id}`}
                                    className="flex items-center gap-4 mb-4 group"
                                >
                                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center border border-gray-100 group-hover:border-green-500 transition-colors">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                        {category.name}
                                    </h3>
                                </Link>

                                <div className="space-y-2">
                                    {relatedSubCategories?.length > 0 ? (
                                        relatedSubCategories.map((sub) => (
                                            <Link
                                                key={sub._id}
                                                to={`/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(sub.name)}-${sub._id}`}
                                                className="block text-sm text-gray-600 hover:text-green-600 hover:translate-x-1 transition-all"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No subcategories</p>
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
