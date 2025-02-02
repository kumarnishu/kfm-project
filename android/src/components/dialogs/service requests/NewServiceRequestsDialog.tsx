import React from 'react'
import NewServiceRequestsForm from '../../forms/service requests/NewServiceRequestsForm';
import { GetRegisteredProductDto } from '../../../dtos/RegisteredProducDto';
import Dialog from '../../common/Dialog';
import { DropDownDto } from '../../../dtos/DropDownDto';

type Props = {
    dialog: string | undefined,
    type: DropDownDto,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    product?: GetRegisteredProductDto
}

function NewServiceRequestsDialog({ product, type, dialog, setDialog }: Props) {

    return (
        <Dialog fullScreen={true} visible={dialog === 'NewServiceRequestsDialog'} handleClose={() => setDialog(undefined)}
        >
            {product && <NewServiceRequestsForm type={type} product={product} setDialog={setDialog} />}
        </Dialog>
    )
}

export default NewServiceRequestsDialog

