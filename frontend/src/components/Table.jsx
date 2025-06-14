import React from "react";
import PropTypes from "prop-types";

const Table = ({ columns, renderRow, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4 border-collapse ">
        <thead>
          <tr className="bg-[#33211D] text-white text-sm rounded-t-lg">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`
                  p-4 text-left
                  ${col.className || ""}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-light rounded-b-lg">
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  renderRow: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default Table;
