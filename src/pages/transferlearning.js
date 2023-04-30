import React from 'react'

import dynamic from 'next/dynamic'

const DynamicCmp = dynamic(() => import('../comp/transferlearningcmp'), {
    ssr: false
})

function Transferlearning() {
    return <DynamicCmp />
}

export default Transferlearning