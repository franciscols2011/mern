import { Fragment } from "react";
import { filterOptions } from "/src/config";
import { Label } from "../ui/label";
import { Checkbox } from "/components/ui/checkbox";
import { Separator } from "/components/ui/separator";

function ProductFilter({ filters, handleFilter }) {
	return (
		<div className="bg-background rounded-lg shadow-sm">
			<div className="p-4 border-b">
				<h2 className="text-lg font-extrabold">Filters</h2>
			</div>

			<div className="p-4 space-y-4">
				{Object.keys(filterOptions).map((keyItem) => (
					<Fragment key={keyItem}>
						<div>
							<h3 className="text-base font-bold">{keyItem}</h3>
							<div className="grid gap-2 mt-2">
								{filterOptions[keyItem].map((option) => (
									<Label
										key={option.id}
										className="flex font-semibold items-center gap-2"
									>
										<Checkbox
											checked={filters[keyItem]?.includes(option.id)}
											onCheckedChange={() => handleFilter(keyItem, option.id)}
										/>
										{option.label}
									</Label>
								))}
							</div>
						</div>
						<Separator />
					</Fragment>
				))}
			</div>
		</div>
	);
}

export default ProductFilter;
