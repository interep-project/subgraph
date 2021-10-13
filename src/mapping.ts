import { BigInt, log } from "@graphprotocol/graph-ts"
import { NewRootHash as NewRootHashEvent } from "./InterRepGroups"
import { Group, Member } from "./schema"

const BIG_INT_ONE = BigInt.fromI32(1)

function getGroup(provider: string, name: string): Group {
    let group = Group.load(provider, name)
    if (group == null) {
        group = new Group(provider, name)
        // group.save()
    }
    return group
}

export function handleNewRootHash(event: NewRootHashEvent): void {
    log.debug(`handleNewRootHash: block {}`, [event.block.number.toString()])

    const entity = new Member(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`)

    log.info("getting group {}", [event.params.groupName.toString()])

    const group = getGroup(event.params.provider.toString(), event.params.groupName.toString())
    group.name = event.params.groupName.toString()
    log.info("group is {}", [group.id])
    group.memberCount = group.memberCount.plus(BIG_INT_ONE)
    group.leafCount = group.leafCount.plus(BIG_INT_ONE)

    entity.group = group.id
    entity.identityCommitment = event.params.identityCommitment.toHexString()
    entity.rootHash = event.params.rootHash.toHexString()
    entity.leafIndex = group.leafCount
    entity.save()

    group.save()
    log.debug("end {}", [group.leafCount.toString()])
}
