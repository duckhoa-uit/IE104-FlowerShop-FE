import React from 'react'
import PropTypes from 'prop-types'

AboutUs.propTypes = {
}

function AboutUs (props) {
  const background = 'https://konsept.qodeinteractive.com/wp-content/uploads/2020/04/About-us_title.jpg'
  return (
    <div className="w-full bg-cover bg-center h-96" style ={{ backgroundImage: 'url(' + background + ')' } }>
      <div className="flex items-center justify-center h-full w-full bg-opacity-50">
            <div className="text-center">
                <h1 className="text-white text-2xl font-josefins font-bold tracking-widest uppercase md:text-4xl">ABOUT US</h1>
            </div>
        </div>
    </div>
  )
}

export default AboutUs
