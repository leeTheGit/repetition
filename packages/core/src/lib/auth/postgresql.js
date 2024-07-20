import { eq, lte } from 'drizzle-orm'
export class DrizzlePostgreSQLAdapter {
    db
    sessionTable
    userTable
    orgTable
    mediaTable
    constructor(db, sessionTable, userTable, orgTable, mediaTable) {
        this.db = db
        this.sessionTable = sessionTable
        this.userTable = userTable
        this.orgTable = orgTable
        this.mediaTable = mediaTable
    }
    async deleteSession(sessionId) {
        await this.db
            .delete(this.sessionTable)
            .where(eq(this.sessionTable.id, sessionId))
    }
    async deleteUserSessions(userId) {
        await this.db
            .delete(this.sessionTable)
            .where(eq(this.sessionTable.userId, userId))
    }
    async getSessionAndUser(sessionId) {

        const result = await this.db
            .select({
                user: this.userTable,
                session: this.sessionTable,
                avatar: this.mediaTable,
            })
            .from(this.sessionTable)
            .innerJoin(
                this.userTable,
                eq(this.sessionTable.userId, this.userTable.id)
            )
            .leftJoin(
                this.mediaTable,
                eq(this.userTable.profileImageId, this.mediaTable.uuid)
            )

            .where(eq(this.sessionTable.id, sessionId))

        if (result.length !== 1) return [null, null]
        console.log(result)
        return [
            transformIntoDatabaseSession(result[0].session),
            transformIntoDatabaseUser(result[0].user, result[0].avatar),
        ]
    }

    async getUserSessions(userId) {
        const result = await this.db
            .select()
            .from(this.sessionTable)
            .where(eq(this.sessionTable.userId, userId))
        return result.map((val) => {
            return transformIntoDatabaseSession(val)
        })
    }
    async setSession(session) {
        await this.db.insert(this.sessionTable).values({
            id: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt,
            ...session.attributes,
        })
    }
    async updateSessionExpiration(sessionId, expiresAt) {
        await this.db
            .update(this.sessionTable)
            .set({
                expiresAt,
            })
            .where(eq(this.sessionTable.id, sessionId))
    }
    async deleteExpiredSessions() {
        await this.db
            .delete(this.sessionTable)
            .where(lte(this.sessionTable.expiresAt, new Date()))
    }
}
function transformIntoDatabaseSession(raw) {
    let { id, userId, expiresAt, ...attributes } = raw

    const res = {
        userId,
        id,
        expiresAt,
        attributes,
    }
    return res
}
function transformIntoDatabaseUser(raw, avatar) {
    let { id, ...attributes } = raw
    if (avatar) {
        attributes.avatar = avatar.cdnUrl
    }
    const res = {
        id,
        attributes,
    }
    return res
}
