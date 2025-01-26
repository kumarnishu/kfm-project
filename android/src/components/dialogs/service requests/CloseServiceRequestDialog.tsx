import { GetRegisteredProductDto } from '../../../dto/RegisteredProducDto';
import Dialog from '../../Dialog';
import NewServiceRequestsForm from '../../forms/service requests/NewServiceRequestsForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    product?: GetRegisteredProductDto
}

function CloseServiceRequestDialog({ product, dialog, setDialog }: Props) {

    return (
       <Dialog fullScreen={false} visible={dialog === 'CloseServiceRequestDialog'} handleClose={() => setDialog(undefined)}
        >
            {product && <NewServiceRequestsForm product={product} setDialog={setDialog} />}
        </Dialog>
    )
}

export default CloseServiceRequestDialog

