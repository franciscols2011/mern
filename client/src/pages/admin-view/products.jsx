import { Fragment, useState } from "react";
import { Button } from "../../components/ui/button";
import { Sheet } from "/components/ui/sheet";
import { SheetContent } from "/components/ui/sheet";
import { SheetHeader } from "/components/ui/sheet";
import { SheetTitle } from "/components/ui/sheet";
import CommonForm from "/src/components/common/form";
import { addProductFormElements } from "/src/config";


const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',	
}

function AdminProducts() {

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);

    const [formData, setFormData] = useState(initialFormData);

    function onSubmit(){

    }

    return <Fragment>
        <div className="mb-5 w-full flex justify-end">
            <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Sheet open={openCreateProductsDialog} onOpenChange={

                () => setOpenCreateProductsDialog(false)
            }>
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Create New Product</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                        <CommonForm
                        onsubmit={onSubmit}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText="Create Product"
                        formControls={addProductFormElements}
                        />
                    </div>

                </SheetContent>
            </Sheet>
        </div>
    </Fragment>
}

export default AdminProducts;