// ==UserScript==
// @name         HOT Tasking Manager Full Crib Sheet Integration
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Embeds the full crib sheet and places a floating button at the bottom-left corner of the screen.
// @author       You
// @match        *://tasks.hotosm.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const cribSheetHTML = `
        <div id="hot-crib-modal" style="display:none; position:fixed; top:40px; right:40px; width:650px; height:80vh; background:white; border:2px solid #ccc; z-index:10000; box-shadow:0 4px 16px rgba(0,0,0,0.3); border-radius:8px; flex-direction:column; font-family:sans-serif;">
            <div style="background:#d32f2f; color:white; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; border-top-left-radius:6px; border-top-right-radius:6px;">
                <h3 style="margin:0; font-size:16px;">HOT Validation Crib Sheet v4 (Full)</h3>
                <button id="close-crib-btn" style="background:none; border:none; color:white; font-size:20px; cursor:pointer;">&times;</button>
            </div>
            <div id="crib-content" style="padding:16px; overflow-y:auto; flex-grow:1; font-size:13px; line-height:1.4; color:#333;">
                <p style="margin-top:0;"><strong>Instructions:</strong> Check/uncheck items below to build your feedback message.</p>
                <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">

                <!-- Salutation -->
                <h4 style="margin:8px 0; color:#d32f2f;">Salutation</h4>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" checked value="Welcome to the tasking manager and thanks for mapping this task."> Welcome to the tasking manager and thanks for mapping this task.</label>

                <!-- Task not mapped -->
                <h4 style="margin:8px 0; color:#d32f2f;">Task Not Mapped / Imagery</h4>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" checked value="Please only use 'The imagery is bad' if the ground is obscured by clouds/smoke/etc or the imagery is so poor that nothing is recognisable, and only then if all of the alternative imagery sources have similar problems."> Imagery usage warning</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="Please only mark the task as complete when it is fully mapped according to the project requirements in the task instructions. If you want to move on and try a different task, just say 'no' to the 'Is this task completely mapped?' question or use the 'select another task' button."> Task completion guidance</label>

                <!-- More work needed -->
                <h4 style="margin:8px 0; color:#d32f2f;">More Work Needed</h4>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" checked value="More work is required to complete this task and ensure that it is well mapped:"> More work is required header</label>
                <div style="padding-left:15px; border-left:2px solid #eee; margin-bottom:8px;">
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- The previously mapped buildings need to be moved to match the current imagery and surrounding tasks."> The previously mapped buildings need to be moved to match current imagery.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- Buildings need to be added and removed to reflect what is visible in the imagery."> Buildings need to be added/removed to reflect imagery.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- There are more buildings that need to be mapped."> There are more buildings that need to be mapped.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- Please map individual buildings without collecting multiple nearby buildings into a single object."> Map individual buildings separately.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- Please accurately outline all buildings."> Accurately outline all buildings.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- Buildings should be mapped without snapping their corners to other buildings and features such as roads and paths."> Do not snap corners to roads/other buildings.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- Buildings should have their corners squared."> Buildings should have squared corners.</label>
                    <label style="display:block; margin-bottom:4px;"><input type="checkbox" class="crib-sub" value="- Buildings should not overlap other buildings and features."> Buildings should not overlap.</label>
                </div>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" checked value="Check the task instructions for the full requirements."> Check task instructions for full requirements.</label>

                <!-- Advice / Tips -->
                <h4 style="margin:8px 0; color:#d32f2f;">Advice / Tips</h4>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="Please map each building as a separate object. Do not combine multiple nearby buildings into one. Zoom in so that you can see the outline of the roofs and look for the gaps between the buildings or different roof colors to help determine where one building ends and another begins."> Tip: Separate objects & gaps</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="When mapping buildings, please trace the shape accurately. Zoom in so that you can see the outline of the building and mark the corners carefully. Don't include the building's shadow."> Tip: Trace accurately & exclude shadows</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="Please do not connect the corners of buildings to other buildings or features such as roads and paths. In the iD Editor, hold down the Alt key to keep nodes from snapping to other objects and accidentally connecting."> Tip: Avoid snapping nodes (Alt key)</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="When parts of a building are obscured by trees, try to estimate where the building continues under the cover and map that."> Tip: Estimate under tree cover</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="When mapping a building at the edge of the task area, please map the whole building. Do not cut it off at the task boundary."> Tip: Map whole buildings at edges</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" checked value="After mapping buildings, please remember to square their corners. Most buildings have square corners because that's easy to build. Unless the building is clearly a different shape then it's best to assume that the corners should be squared. In the iD Editor, use the Q key to square the corners."> Tip: Square corners using Q key</label>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" value="When mapping buildings that are particularly tall, please map them where the walls meet the ground. You can map the outline of the roof and then reposition the building to the base of the walls."> Tip: Tall buildings at ground level</label>

                <!-- Exhortation -->
                <h4 style="margin:8px 0; color:#d32f2f;">Exhortation</h4>
                <label style="display:block; margin-bottom:6px;"><input type="checkbox" class="crib-opt" checked value="Keep on mapping!"> Keep on mapping!</label>
            </div>
            <div style="padding:12px 16px; background:#f1f1f1; border-top:1px solid #ddd; display:flex; justify-content:space-between; align-items:center; border-bottom-left-radius:6px; border-bottom-right-radius:6px;">
                <span id="preview-char-count" style="font-size:12px; color:#666;"></span>
                <button id="inject-comment-btn" style="background:#d32f2f; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:bold;">Insert into Comment Box</button>
            </div>
        </div>
    `;

    // Inject modal into DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = cribSheetHTML;
    document.body.appendChild(wrapper);

    const modal = document.getElementById('hot-crib-modal');

    // Create a guaranteed floating button at the bottom-left of the viewport
    const triggerBtn = document.createElement('button');
    triggerBtn.innerText = "Open Crib Sheet";
    triggerBtn.style.cssText = "position:fixed; bottom:20px; left:20px; z-index:99999; background:#d32f2f; color:white; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:14px;";
    document.body.appendChild(triggerBtn);

    // Toggle handlers
    triggerBtn.addEventListener('click', () => {
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    });

    document.getElementById('close-crib-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle comment injection with double newlines separating options
    document.getElementById('inject-comment-btn').addEventListener('click', () => {
        const checkedOpts = Array.from(document.querySelectorAll('.crib-opt:checked')).map(cb => cb.value);
        const checkedSubs = Array.from(document.querySelectorAll('.crib-sub:checked')).map(cb => cb.value);

        let allItems = [...checkedOpts];
        if (checkedSubs.length > 0) {
            allItems = allItems.concat(checkedSubs);
        }

        let feedbackText = allItems.join('\n\n');

        const commentBox = document.querySelector('textarea');
        if (commentBox) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(commentBox, feedbackText);

            commentBox.dispatchEvent(new Event('input', { bubbles: true }));
            commentBox.dispatchEvent(new Event('change', { bubbles: true }));

            modal.style.display = 'none';
        } else {
            alert("Comment box textarea not found. Please make sure you have the task comment view open on the page.");
        }
    });

})();