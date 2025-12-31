/**
 * Base class for all pipeline steps.
 * Implements the command pattern for the pipeline.
 */
export class Step {
    constructor(name) {
        this.name = name;
    }

    /**
     * Eecutes the step logic.
     * @param {Object} context - The shared context object passed through the pipeline.
     * @returns {Promise<Object>} - The updated context.
     */
    async execute(context) {
        throw new Error('Method execute() must be implemented');
    }
}
