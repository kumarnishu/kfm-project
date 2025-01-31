import React from 'react'
import { GetRegisteredProductDto } from '../../../dtos/RegisteredProducDto';
import Dialog from '../../common/Dialog';
import CreateOrEditRegisteredProductForm from '../../forms/products/CreateOrEditRegisteredProductForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    product?: GetRegisteredProductDto
}

function CreateOrEditRegisteredProductDialog({ product, dialog, setDialog }: Props) {
    
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditRegisteredProductDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditRegisteredProductForm  product={product} setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditRegisteredProductDialog

