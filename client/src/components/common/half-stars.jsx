import React from "react";
import { Star as StarIcon } from "lucide-react";

function HalfStar() {
	return (
		<div className="relative w-5 h-5">
			<StarIcon className="w-5 h-5 text-yellow-300" />
			<StarIcon
				className="w-5 h-5 text-yellow-400 absolute top-0 left-0 overflow-hidden"
				style={{ width: "50%" }}
			/>
		</div>
	);
}

export default HalfStar;
