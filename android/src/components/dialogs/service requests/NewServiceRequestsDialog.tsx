import React from 'react'
import NewServiceRequestsForm from '../../forms/service requests/NewServiceRequestsForm';
import { GetRegisteredProductDto } from '../../../dtos/RegisteredProducDto';
import Dialog from '../../common/Dialog';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    product?: GetRegisteredProductDto
}

function NewServiceRequestsDialog({ product, dialog, setDialog }: Props) {

    return (
       <Dialog fullScreen={false} visible={dialog === 'NewServiceRequestsDialog'} handleClose={() => setDialog(undefined)}
        >
            {product && <NewServiceRequestsForm product={product} setDialog={setDialog} />}
        </Dialog>
    )
}

export default NewServiceRequestsDialog

