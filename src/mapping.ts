import { log } from "@graphprotocol/graph-ts"
import { MerkleTreeAdded } from "../generated/Interep/Interep"
import { MerkleTree } from "../generated/schema"

/**
 * Adds an Interep Merkle tree.
 * @param event Ethereum event emitted when new Interep Merkle trees are saved on-chain.
 */
// eslint-disable-next-line import/prefer-default-export
export function addMerkleTree(event: MerkleTreeAdded): void {
    log.debug(`MerkleTreeAdded event block: {}`, [event.block.number.toString()])

    let group = MerkleTree.load(event.params.root.toString())

    log.info("Creating Interep Merkle tree '{}'", [event.params.root.toString()])

    group = new MerkleTree(event.params.root.toString())

    group.root = event.params.root
    group.depth = event.params.depth

    group.save()

    log.info("Interep group '{}' has been created", [group.id])
}
