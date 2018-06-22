import assert from 'assert';
import { until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CustomFormPage';
import showPageFactory from '../pages/ShowPage';

describe.only('Custom Forms', () => {
    const CreatePage = createPageFactory(
        'http://localhost:8083/#/comments/create'
    )(driver);

    const ShowPage = showPageFactory('http://localhost:8083/#/posts/14/show')(
        driver
    );

    beforeEach(async () => await CreatePage.navigate());

    it('should allows to preview the selected post', async () => {
        await driver.wait(until.elementLocated(CreatePage.elements.postSelect));
        await driver.findElement(CreatePage.elements.postSelect).click();
        await driver.wait(
            until.elementLocated(CreatePage.elements.postItem(12))
        );
        const postItem = driver.findElement(CreatePage.elements.postItem(12));
        await postItem.click();
        await driver.wait(until.elementIsNotVisible(postItem));
        await driver.sleep(250); // wait for the dropdown overlay to disapear

        await driver.wait(
            until.elementLocated(CreatePage.elements.showPostPreviewModalButton)
        );
        await driver
            .findElement(CreatePage.elements.showPostPreviewModalButton)
            .click();
        await driver.wait(
            until.elementLocated(CreatePage.elements.postPreviewModal)
        );
        await driver.sleep(250); // wait for the small loading time

        assert.equal(await ShowPage.getValue('id'), '12');

        assert.equal(
            await ShowPage.getValue('title'),
            'Qui tempore rerum et voluptates'
        );
        assert.equal(
            await ShowPage.getValue('teaser'),
            'Occaecati rem perferendis dolor aut numquam cupiditate. At tenetur dolores pariatur et libero asperiores porro voluptas. Officiis corporis sed eos repellendus perferendis distinctio hic consequatur.'
        );
    });
});
