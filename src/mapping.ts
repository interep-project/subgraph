import { BigInt, log, ByteArray } from "@graphprotocol/graph-ts"
import {
    GroupAdded,
    IdentityCommitmentAdded,
    IdentityCommitmentDeleted,
    OffchainRoot
} from "../generated/Groups/Groups"
import { Group, Member, OffchainGroup } from "../generated/schema"
import { concat, hash } from "./utils"

/**
 * Adds an offchain group in the storage.
 * @param event Ethereum event emitted when an offchain root is published.
 */
export function updateOffchainGroup(event: OffchainRoot): void {
    log.debug(`OffchainRoot event block: {}`, [event.block.number.toString()])

    const groupId = hash(concat(event.params.provider, event.params.name))
    let group = OffchainGroup.load(groupId)

    // Creates the group if it is not exist.
    if (group === null) {
        log.info("Creating offchain group '{}' with provider '{}' and name '{}'", [
            groupId,
            event.params.provider.toString(),
            event.params.name.toString()
        ])

        group = new OffchainGroup(groupId)

        group.provider = event.params.provider.toString()
        group.name = event.params.name.toString()
        group.roots = [event.params.root]

        group.save()

        log.info("Offchain group with provider '{}' and name '{}' has been created", [
            group.id,
            event.params.provider.toString(),
            event.params.name.toString()
        ])
    }
    // Add the root to an existing offchain group.
    else {
        group.roots.push(event.params.root)

        group.save()

        log.info("Merkle root of the offchain group with provider '{}' and name '{}' has been added", [
            group.id,
            event.params.provider.toString(),
            event.params.name.toString()
        ])
    }
}

/**
 * Adds a group in the storage.
 * @param event Ethereum event emitted when a group is created.
 */
export function addGroup(event: GroupAdded): void {
    log.debug(`GroupAdded event block: {}`, [event.block.number.toString()])

    const groupId = hash(concat(event.params.provider, event.params.name))
    const group = new Group(groupId)

    log.info("Creating group '{}' with provider '{}' and name '{}'", [
        group.id,
        event.params.provider.toString(),
        event.params.name.toString()
    ])

    group.provider = event.params.provider.toString()
    group.name = event.params.name.toString()
    group.depth = event.params.depth
    group.size = 0

    group.save()

    log.info("Group with provider '{}' and name '{}' has been created", [
        group.id,
        event.params.provider.toString(),
        event.params.name.toString()
    ])
}

/**
 * Adds a member in a group.
 * @param event Ethereum event emitted when an identity commitment is added to a group.
 */
export function addMember(event: IdentityCommitmentAdded): void {
    log.debug(`IdentityCommitmentAdded event block {}`, [event.block.number.toString()])

    const groupId = hash(concat(event.params.provider, event.params.name))
    const group = Group.load(groupId)

    if (group) {
        const memberId = hash(
            concat(ByteArray.fromBigInt(event.params.identityCommitment), ByteArray.fromHexString(groupId))
        )
        const member = new Member(memberId)

        log.info("Adding member '{}' in the group with provider '{}' and name '{}'", [
            member.id,
            event.params.provider.toString(),
            event.params.name.toString()
        ])

        member.group = groupId
        member.identityCommitment = event.params.identityCommitment
        member.root = event.params.root
        member.index = group.size

        member.save()

        group.size += 1

        group.save()

        log.info("Member '{}' of the group with provider '{}' and name '{}' has been added", [
            member.id,
            event.params.provider.toString(),
            event.params.name.toString()
        ])
    }
}

/**
 * Deletes an identity commitment from a group.
 * @param event Ethereum event emitted when an identity commitment is deleted from a group.
 */
export function deleteMember(event: IdentityCommitmentDeleted): void {
    log.debug(`IdentityCommitmentDeleted event block {}`, [event.block.number.toString()])

    const groupId = hash(concat(event.params.provider, event.params.name))
    const memberId = hash(
        concat(ByteArray.fromBigInt(event.params.identityCommitment), ByteArray.fromHexString(groupId))
    )
    const member = new Member(memberId)

    log.info("Deleting member '{}' from the group with provider '{}' and name '{}'", [
        member.id,
        event.params.provider.toString(),
        event.params.name.toString()
    ])

    member.identityCommitment = BigInt.zero()
    member.root = event.params.root

    member.save()

    log.info("Member '{}' of the group with provider '{}' and name '{}' has been deleted", [
        member.id,
        event.params.provider.toString(),
        event.params.name.toString()
    ])
}
