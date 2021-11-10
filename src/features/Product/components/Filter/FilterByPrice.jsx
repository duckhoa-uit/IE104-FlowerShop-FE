import { path } from '@/constants/path'
import { yupResolver } from '@hookform/resolvers/yup'
import { Slider } from '@mui/material'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import * as yup from 'yup'
import './FilterByPrice.scss'

FilterByPrice.propTypes = {
   filters: PropTypes.object.isRequired
}

function FilterByPrice({ filters }) {
   const history = useHistory()
   const schema = yup.object().shape({
      priceRange: yup.array().length(2)
   })
   const { control, handleSubmit } = useForm({
      defaultValues: {
         priceRange: [filters.minPrice || 0, filters.maxPrice || 100]
      },
      resolver: yupResolver(schema)
   })

   const handleFilterPriceClick = ({ priceRange }) => {
      const minPrice = priceRange[0]
      const maxPrice = priceRange[1]
      if (minPrice !== 0 || maxPrice !== 0) {
         let _filters = filters
         if (minPrice !== 0) {
            _filters = { ..._filters, minPrice }
         } else {
            delete _filters.minPrice
         }
         if (maxPrice !== 0) {
            _filters = { ..._filters, maxPrice }
         } else {
            delete _filters.maxPrice
         }
         history.push(path.products + `?${queryString.stringify(_filters)}`)
      }
   }

   return (
      <div className="filter-by-price">
         <h4>Filter by Price</h4>
         <form onSubmit={handleSubmit(handleFilterPriceClick)}>
            <Controller
               name="priceRange"
               control={control}
               render={({ field: { value, onChange } }) => (
                  <>
                     <Slider
                        getAriaLabel={() => 'Price range'}
                        size="small"
                        min={0}
                        step={1}
                        max={100}
                        value={value}
                        onChange={onChange}
                        className="price__slider"
                     />
                     <div className="price__viewer">
                        <div className="price__range text--italic">
                           Price:
                           <span className="from"> ${value[0]}</span>
                           <span className="to"> — ${value[1]}</span>
                        </div>
                        <button type="submit" className="konsept-link price__filter">FILTER</button>
                     </div>
                  </>
               )}
            />

         </form>
      </div>
   )
}

export default FilterByPrice
