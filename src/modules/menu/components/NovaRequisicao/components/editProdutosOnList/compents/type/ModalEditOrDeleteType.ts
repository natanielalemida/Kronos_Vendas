import {ProdutoBodyCreateQtAndObsDto} from '../../../../../../../../sync/products/type';

export type ModalEditOrDeleteProps = {
  produto: ProdutoBodyCreateQtAndObsDto | undefined;
  isModalActive: boolean;
  setModalActive: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
};
