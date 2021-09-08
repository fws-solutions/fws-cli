/**
 * SVGO configuration
 *
 * @description Configure SVG Optimizer tool for optimizing SVG vector graphics files.
 */

module.exports = [
    {
        name: 'preset-default',
        params: {
            overrides: {
                removeViewBox: false,
                removeRasterImages: false
            }
        }
    },
    'cleanupAttrs',
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'convertStyleToAttrs',
    'cleanupEnableBackground',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'cleanupIDs',
    'cleanupNumericValues',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'mergePaths',
    'convertShapeToPath',
    'sortAttrs',
    'removeDimensions',
    {
        name: 'removeAttrs',
        params: {
            attrs: '(stroke|fill|style)'
        }
    },
    {
        name: 'addAttributesToSVGElement',
        params: {
            attributes: ['fill="currentColor"']
        }
    }
];
