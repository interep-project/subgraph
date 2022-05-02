import { log } from "@graphprotocol/graph-ts"
import { GroupUpdated } from "../generated/Interep/Interep"
import { Group } from "../generated/schema"

/**
 * Updates an Interep group.
 * @param event Ethereum event emitted when new Interep groups are saved on-chain.
 */
// eslint-disable-next-line import/prefer-default-export
export function updateGroup(event: GroupUpdated): void {
    log.debug(`GroupUpdated event block: {}`, [event.block.number.toString()])

    let group = Group.load(event.params.groupId.toString())

    // Creates the group if it is not exist.
    if (group === null) {
        log.info("Creating Interep group '{}'", [event.params.groupId.toString()])

        group = new Group(event.params.groupId.toString())

        group.provider = event.params.provider.toString()
        group.name = event.params.name.toString()
        group.root = event.params.root
        group.depth = event.params.depth

        group.save()

        log.info("Interep group '{}' has been created", [group.id])
    }

    // Update the root and the depth of an existing Interep group.
    else {
        group.root = event.params.root
        group.depth = event.params.depth

        group.save()

        log.info("Interep group '{}' has been updated", [group.id])
    }
}
