import { GetRegisteredProductDto } from '../../../dto/RegisteredProducDto';
import Dialog from '../../Dialog';
import NewServiceRequestsForm from '../../forms/service requests/NewServiceRequestsForm';

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

