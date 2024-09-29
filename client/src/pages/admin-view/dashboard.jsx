import { Button } from "/src/components/ui/button";
import ProductImageUpload from "/src/components/admin-view/image-upload";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addFeatureImage,
	getFeatureImage,
	deleteFeatureImage,
} from "/src/store/common-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "/src/hooks/use-toast";

function AdminDashboard() {
	const [imageFile, setImageFile] = useState(null);
	const [uploadedImageUrl, setUploadedImageUrl] = useState("");
	const [imageLoadingState, setImageLoadingState] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { featureImageList, isLoading, error } = useSelector(
		(state) => state.commonFeature
	);
	const { toast } = useToast();

	function handleUploadFeatureImage() {
		dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
			if (data?.payload?.success) {
				dispatch(getFeatureImage());
				toast({
					title: "Feature image uploaded successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				setUploadedImageUrl("");
				setImageFile(null);
			} else {
				toast({
					title: "Failed to upload feature image",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		});
	}

	function handleDeleteFeatureImage(id) {
		dispatch(deleteFeatureImage(id)).then((data) => {
			if (data?.payload?.success) {
				dispatch(getFeatureImage());
				toast({
					title: "Feature image deleted successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Failed to delete feature image",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		});
	}

	useEffect(() => {
		dispatch(getFeatureImage());
	}, [dispatch]);

	return (
		<div className="w-full mx-auto p-8 bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
			<h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
				Manage Feature Images
			</h1>
			<div className="bg-white p-6 rounded-lg shadow-md">
				<ProductImageUpload
					imageFile={imageFile}
					setImageFile={setImageFile}
					uploadedImageUrl={uploadedImageUrl}
					setUploadedImageUrl={setUploadedImageUrl}
					setImageLoadingState={setImageLoadingState}
					imageLoadingState={imageLoadingState}
					isCustomStyling={true}
				/>
				<Button
					onClick={handleUploadFeatureImage}
					className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-300"
				>
					Upload
				</Button>
			</div>
			<div className="mt-12">
				{isLoading ? (
					<p className="text-center text-gray-600">Loading...</p>
				) : featureImageList && featureImageList.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
						{featureImageList.map((featureImage) => (
							<div key={featureImage._id} className="relative group">
								<img
									src={featureImage.image}
									alt="Feature"
									className="w-full h-64 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
								/>
								<Button
									onClick={() => handleDeleteFeatureImage(featureImage._id)}
									className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</Button>
							</div>
						))}
					</div>
				) : (
					<p className="text-center text-gray-600">No feature images found.</p>
				)}
			</div>
		</div>
	);
}

export default AdminDashboard;
