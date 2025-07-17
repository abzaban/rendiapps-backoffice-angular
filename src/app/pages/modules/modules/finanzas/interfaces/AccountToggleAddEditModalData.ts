import { EntityServiceModalData } from '../../../../../interfaces/EntityServiceModalData';

import { WalletService } from '../../../../../services/wallet.service';

import { Account } from './Account';

export interface AccountToggleAddEditModalData extends EntityServiceModalData<WalletService, Account> {
    ownerId: string | null;
}