import { GetRegisteredProductDto } from '../../../dto/RegisteredProducDto';
import Dialog from '../../Dialog';
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

