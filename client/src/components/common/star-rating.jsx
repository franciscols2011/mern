import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<Button
					key={star}
					className={`p-2 rounded-full transition-colors ${
						star <= rating
							? "bg-yellow-400 hover:bg-yellow-500"
							: "bg-gray-200 hover:bg-gray-300"
					}`}
					variant="ghost"
					size="icon"
					onClick={handleRatingChange ? () => handleRatingChange(star) : null}
				>
					<StarIcon
						className={`w-5 h-5 ${
							star <= rating ? "text-yellow-500" : "text-gray-400"
						}`}
					/>
				</Button>
			))}
		</div>
	);
}

export default StarRatingComponent;
