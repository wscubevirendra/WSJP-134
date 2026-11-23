const TableSkeleton = ({ rows = 6 }) => {
    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white  overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">

                <div>
                    <div className="h-5 w-36 rounded-md bg-gray-200 animate-pulse" />
                    <div className="mt-2 h-3 w-48 rounded-md bg-gray-100 animate-pulse" />
                </div>

                <div className="h-11 w-36 rounded-xl bg-gray-200 animate-pulse" />

            </div>

            {/* Table */}
            <div className="overflow-x-auto p-1">

                <table className="w-full min-w-175 text-left">

                    {/* Table Header */}
                    <thead>
                        <tr className="border-b border-gray-200">

                            {["Category Name", "Created At", "Status", "Action"].map((item) => (
                                <th
                                    key={item}
                                    className={`px-4 py-5 ${item === "Category Name" ? "px-6" : ""} ${item === "Action" ? "text-center" : ""}`}
                                >
                                    <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                                </th>
                            ))}

                        </tr>
                    </thead>

                    {/* Skeleton Body */}
                    <tbody>

                        {Array.from({ length: rows }).map((_, index) => (

                            <tr
                                key={index}
                                className="border-b border-gray-200"
                            >

                                {/* Category Name */}
                                <td className="px-4 py-3">

                                    <div className="flex items-center gap-4">

                                        <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 animate-pulse" />

                                        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />

                                    </div>

                                </td>

                                {/* Created At */}
                                <td className="px-4 py-3">

                                    <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />

                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">

                                    <div className="h-7 w-20 rounded-full bg-gray-200 animate-pulse" />

                                </td>

                                {/* Action */}
                                <td className="px-4 py-3">

                                    <div className="flex justify-center">

                                        <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse" />

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default TableSkeleton;
