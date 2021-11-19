import StorageKeys from '@/constants/StorageKeys'
import { getCart } from '@/features/Cart/cartSlice'
import { addToCart, getCategories } from '@/features/Product/productSlice'
import { useAuthenticated } from '@/hooks/useAuthenticated'
import useQuery from '@/hooks/useQuery'
import { common } from '@/utils/common'
import { renderPaginationText } from '@/utils/helper'
import { Box, Pagination, Skeleton, Stack } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { useSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FilterPanel from '../components/Filter/FilterPanel'
import ProductList from '../components/ProductList'
import ProductSkeletonList from '../components/ProductSkeletonList'
import productApi from '../productApi'
import './ProductListPage.scss'

function ProductListPage() {
   const authenticated = useAuthenticated()
   const dispatch = useDispatch()
   const { enqueueSnackbar } = useSnackbar()
   const cartId = useSelector(state => state.cart._id)

   const productListRef = useRef(null)
   const [loading, setLoading] = useState(true)
   const [data, setData] = useState([])
   const [categories, setCategories] = useState([])
   const [pagination, setPagination] = useState({
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10
   })

   const queryParams = useQuery()
   const filters = {
      minPrice: Number.parseInt(queryParams.minPrice) || 0,
      maxPrice: Number.parseInt(queryParams.maxPrice) || 100
   }

   useEffect(() => {
      (async() => {
         try {
            const res = await dispatch(getCategories())
            const result = unwrapResult(res)
            setCategories(result.data)
         } catch (error) {
            console.log(error)
         }
      })()
   }, [dispatch])

   const getProducts = async(_pagination) => {
      setLoading(true)
      try {
         const payload = {
            page: _pagination.currentPage,
            pageSize: _pagination.pageSize,
            ...filters
         }
         const res = await productApi.getProducts(payload)
         console.log(res)
         setData(res.data)
         setPagination(res.pagination)
      } catch (error) {
         console.log(error)
      }
      setLoading(false)
   }

   useEffect(() => {
      getProducts({ currentPage: 1, pageSize: 10 })
   }, [queryParams])

   const handleChangePagination = (_, value) => {
      executeScroll()
      getProducts({ currentPage: value, pageSize: pagination.pageSize })
   }
   const executeScroll = () => productListRef.current.scrollIntoView()

   const handleAddProductToCart = async(product) => {
      if (authenticated) {
         try {
            const data = {
               products: [
                  {
                     productId: product._id,
                     quantity: 1
                  }
               ]
            }
            const res = await dispatch(addToCart(cartId, data)).then(unwrapResult)
            enqueueSnackbar(res.message, {
               variant: 'success'
            })
            await dispatch(getCart()).then(unwrapResult)
         } catch (error) {
            enqueueSnackbar(error.message, {
               variant: 'error'
            })
         }
      } else {
         console.log(localStorage.getItem(StorageKeys.cart))
         // Add to localStorage
         common.addProductToCartLocalStorage(product._id, 1)
      }
   }

   return (
      <main className="products konsept-container">
         <div className="products__filters">
            <FilterPanel categories={categories} filters={filters}/>
         </div>
         <div className="products__list" ref={productListRef}>
            <Box pl="10px" mb={3} mt={2} className="text--italic color--gray">
               {loading
                  ? <Skeleton width="180px" height="25px"/>
                  : <h5>{renderPaginationText(pagination)}</h5>
               }
            </Box>
            {loading
               ? <ProductSkeletonList />
               : <ProductList data={data} onAddCart={handleAddProductToCart}/>
            }

            <Stack
               direction="row"
               justifyContent="center"
            >
               <Pagination count={pagination.totalPages} page={pagination.currentPage} onChange={handleChangePagination} />
            </Stack>
         </div>
      </main>
   )
}

export default ProductListPage
