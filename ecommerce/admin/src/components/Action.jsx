
import {
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import api from "../api/axiosInstance";
import { toast } from "sonner";
import Swal from 'sweetalert2'
import { RiUpload2Line } from "react-icons/ri";



function Action({ onView = null, onEdit, path, uploadImages = null }) {
  async function deleteHanlder() {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await api.delete(path);
          if (response.data.success) {
            toast.success(response.data.message)
            // revalidator.revalidate()
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });




    } catch (error) {
      toast.error(
        error.response?.data?.message || "Internal Server Error"
      );
    }
  }
  return (
    <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">

      {/* View */}
      {
        onView && <button
          onClick={onView}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          <FiEye size={17} />
          View
        </button>
      }

      {
        uploadImages && <button
          onClick={uploadImages}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          <RiUpload2Line size={17} />
          Upload Image
        </button>
      }


      {/* Edit */}
      <button
        onClick={onEdit}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
      >
        <FiEdit2 size={17} />
        Edit
      </button>

      {/* Delete */}
      <button
        onClick={deleteHanlder}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
      >
        <FiTrash2 size={17} />
        Delete
      </button>

    </div>
  );
}

export default Action;
