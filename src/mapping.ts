import { BigInt, log, ByteArray } from "@graphprotocol/graph-ts"
import { GroupAdded, IdentityCommitmentAdded, IdentityCommitmentDeleted } from "../generated/Groups/Groups"
import { Group, Member } from "../generated/schema"
import { concat, hash } from "./utils"

/**
 * Adds a group in the storage.
 * @param event Ethereum event emitted when a group is created.
 */
export function addGroup(event: GroupAdded): void {
    log.debug(`GroupAdded event block: {}`, [event.block.number.toString()])

    const { provider, name, depth } = event.params

    const groupId = hash(concat(provider, name))
    const group = new Group(groupId)

    log.info("Creating group '{}' with provider '{}' and name '{}'", [group.id, provider.toString(), name.toString()])

    group.provider = provider.toString()
    group.name = name.toString()
    group.depth = depth
    group.size = 0

    group.save()

    log.info("Group with provider '{}' and name '{}' has been created", [provider.toString(), name.toString()])
}

/**
 * Adds an identity commitment in a group.
 * @param event Ethereum event emitted when an identity commitment is added to a group.
 */
export function addIdentityCommitment(event: IdentityCommitmentAdded): void {
    log.debug(`IdentityCommitmentAdded event block {}`, [event.block.number.toString()])

    const { provider, name, identityCommitment, root } = event.params

    const groupId = hash(concat(provider, name))
    const group = Group.load(groupId)

    if (group) {
        const memberId = hash(concat(ByteArray.fromBigInt(identityCommitment), ByteArray.fromHexString(groupId)))
        const member = new Member(memberId)

        log.info("Adding member '{}' in the group with provider '{}' and name '{}'", [
            member.id,
            provider.toString(),
            name.toString()
        ])

        member.group = groupId
        member.identityCommitment = identityCommitment
        member.root = root
        member.index = group.size

        member.save()

        group.size += 1

        group.save()

        log.info("Member '{}' of the group with provider '{}' and name '{}' has been added", [
            member.id,
            provider.toString(),
            name.toString()
        ])
    }
}

/**
 * Deletes an identity commitment from a group.
 * @param event Ethereum event emitted when an identity commitment is deleted from a group.
 */
export function deleteIdentityCommitment(event: IdentityCommitmentDeleted): void {
    log.debug(`IdentityCommitmentDeleted event block {}`, [event.block.number.toString()])

    const { provider, name, identityCommitment, root } = event.params

    const groupId = hash(concat(provider, name))
    const memberId = hash(concat(ByteArray.fromBigInt(identityCommitment), ByteArray.fromHexString(groupId)))
    const member = new Member(memberId)

    log.info("Deleting member '{}' from the group with provider '{}' and name '{}'", [
        member.id,
        provider.toString(),
        name.toString()
    ])

    member.identityCommitment = BigInt.zero()
    member.root = root

    member.save()

    log.info("Member '{}' of the group with provider '{}' and name '{}' has been deleted", [
        member.id,
        provider.toString(),
        name.toString()
    ])
}
