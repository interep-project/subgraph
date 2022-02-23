import { BigInt, log, ByteArray, crypto } from "@graphprotocol/graph-ts"
import { GroupAdded, MemberAdded, MemberRemoved, OffchainGroupAdded } from "../generated/Interep/Interep"
import { OnchainGroup, Member, OffchainGroup } from "../generated/schema"
import { concat, hash } from "./utils"

/**
 * Adds an offchain group in the storage.
 * @param event Ethereum event emitted when an offchain group is published.
 */
export function updateOffchainGroup(event: OffchainGroupAdded): void {
    log.debug(`OffchainGroupAdded event block: {}`, [event.block.number.toString()])

    let group = OffchainGroup.load(event.params.groupId.toString())

    // Creates the group if it is not exist.
    if (group === null) {
        log.info("Creating offchain group '{}'", [event.params.groupId.toString()])

        group = new OffchainGroup(event.params.groupId.toString())

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
 * Adds a group in the storage.
 * @param event Ethereum event emitted when a onchain group is created.
 */
export function createOnchainGroup(event: GroupAdded): void {
    log.debug(`GroupAdded event block: {}`, [event.block.number.toString()])

    const group = new OnchainGroup(event.params.groupId.toString())

    log.info("Creating onchain group '{}'", [group.id])

    group.depth = event.params.depth
    group.size = 0

    group.save()

    log.info("Onchain group '{}' has been created", [group.id])
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
        member.root = event.params.root
        member.index = group.size

        member.save()

        group.size += 1

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

    const memberId = hash(
        concat(ByteArray.fromBigInt(event.params.identityCommitment), ByteArray.fromBigInt(event.params.groupId))
    )
    const member = new Member(memberId)

    log.info("Removing member '{}' from the onchain group '{}'", [member.id, event.params.groupId.toString()])

    member.identityCommitment = BigInt.fromByteArray(crypto.keccak256(ByteArray.fromUTF8("Semaphore")))
    member.root = event.params.root

    member.save()

    log.info("Member '{}' of the onchain group '{}' has been removed", [member.id, event.params.groupId.toString()])
}
