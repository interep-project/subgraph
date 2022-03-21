import { ByteArray, log } from "@graphprotocol/graph-ts"
import {
    GroupAdminUpdated,
    GroupCreated,
    MemberAdded,
    MemberRemoved,
    OffchainGroupUpdated
} from "../generated/Interep/Interep"
import { Member, OffchainGroup, OnchainGroup } from "../generated/schema"
import { concat, hash } from "./utils"

/**
 * Updates an offchain group.
 * @param event Ethereum event emitted when an offchain group is published.
 */
export function updateOffchainGroup(event: OffchainGroupUpdated): void {
    log.debug(`OffchainGroupUpdated event block: {}`, [event.block.number.toString()])

    let group = OffchainGroup.load(event.params.groupId.toString())

    // Creates the group if it is not exist.
    if (group === null) {
        log.info("Creating offchain group '{}'", [event.params.groupId.toString()])

        group = new OffchainGroup(event.params.groupId.toString())

        group.provider = event.params.provider.toString()
        group.name = event.params.name.toString()
        group.root = event.params.root
        group.depth = event.params.depth

        group.save()

        log.info("Offchain group '{}' has been created", [group.id])
    }
    // Update the root and the depth of an existing offchain group.
    else {
        group.root = event.params.root
        group.depth = event.params.depth

        group.save()

        log.info("Offchain group '{}' has been updated", [group.id])
    }
}

/**
 * Creates an onchain group.
 * @param event Ethereum event emitted when a onchain group is created.
 */
export function createOnchainGroup(event: GroupCreated): void {
    log.debug(`GroupCreated event block: {}`, [event.block.number.toString()])

    const group = new OnchainGroup(event.params.groupId.toString())

    log.info("Creating onchain group '{}'", [group.id])

    group.depth = event.params.depth
    group.zeroValue = event.params.zeroValue
    group.size = 0
    group.numberOfLeaves = 0

    group.save()

    log.info("Onchain group '{}' has been created", [group.id])
}

/**
 * Updates the admin of an onchain group.
 * @param event Ethereum event emitted when a onchain group admin is updated.
 */
export function updateOnchainGroupAdmin(event: GroupAdminUpdated): void {
    log.debug(`GroupAdminUpdated event block: {}`, [event.block.number.toString()])

    const group = OnchainGroup.load(event.params.groupId.toString())

    if (group) {
        log.info("Updating admin '{}' in the onchain group '{}'", [event.params.newAdmin.toString(), group.id])

        group.admin = event.params.newAdmin

        group.save()

        log.info("Admin '{}' of the onchain group '{}' has been updated ", [group.admin.toString(), group.id])
    }
}

/**
 * Adds a member in a group.
 * @param event Ethereum event emitted when a member is added to a group.
 */
export function addMember(event: MemberAdded): void {
    log.debug(`MemberAdded event block {}`, [event.block.number.toString()])

    const group = OnchainGroup.load(event.params.groupId.toString())

    if (group) {
        const memberId = hash(
            concat(ByteArray.fromBigInt(event.params.identityCommitment), ByteArray.fromBigInt(event.params.groupId))
        )
        const member = new Member(memberId)

        log.info("Adding member '{}' in the onchain group '{}'", [member.id, group.id])

        member.group = group.id
        member.identityCommitment = event.params.identityCommitment
        member.index = group.size

        member.save()

        group.root = event.params.root
        group.size += 1
        group.numberOfLeaves += 1

        group.save()

        log.info("Member '{}' of the onchain group '{}' has been added", [member.id, group.id])
    }
}

/**
 * Removes a member from a group.
 * @param event Ethereum event emitted when a member is removed from a group.
 */
export function removeMember(event: MemberRemoved): void {
    log.debug(`MemberRemoved event block {}`, [event.block.number.toString()])

    const group = OnchainGroup.load(event.params.groupId.toString())

    if (group) {
        const memberId = hash(
            concat(ByteArray.fromBigInt(event.params.identityCommitment), ByteArray.fromBigInt(event.params.groupId))
        )
        const member = new Member(memberId)

        log.info("Removing member '{}' from the onchain group '{}'", [member.id, event.params.groupId.toString()])

        member.identityCommitment = group.zeroValue

        member.save()

        group.root = event.params.root
        group.size -= 1

        group.save()

        log.info("Member '{}' of the onchain group '{}' has been removed", [member.id, event.params.groupId.toString()])
    }
}
