import React from 'react'

const VariantAttributes = ({ attributes }:
  {
    attributes: { attributeName: string, attributeValue: string }[]
  }) => (
  <div>
    <h3 className="font-semibold mb-2">Thông số kỹ thuật</h3>
    <div className="grid grid-cols-2 gap-2">
      {attributes.map((attr) => (
        <div key={attr.attributeName} className="flex">
          <span className="text-gray-600 w-24">{attr.attributeName}:</span>
          <span className="font-medium">{attr.attributeValue}</span>
        </div>
      ))}
    </div>
  </div>
);
export default VariantAttributes
