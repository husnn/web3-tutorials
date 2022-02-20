const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');

const Market = artifacts.require('Market');
const NFT = artifacts.require('NFT');

contract('Market', (accounts) => {
  let market;
  let token;

  const minter = accounts[1];
  const tokenId = new BN(1);
  let listingId = new BN(1);
  const price = new BN(1000);

  describe('List token', () => {
    before(async () => {
      market = await Market.new();
      token = await NFT.new();

      await token.mint({ from: minter });
    });

    it('should prevent listing - contract not approved', () => {
      return expectRevert(
        market.listToken(
        token.address,
        tokenId,
        price
      ), 'ERC721: transfer caller is not owner nor approved');
    });

    it('should execute listing', async () => {
      await token.approve(market.address, tokenId, {
        from: minter
      });

      const tx = await market.listToken(
        token.address,
        tokenId,
        price,
        { from: minter }
      );

      expectEvent(tx, 'Listed', {
        listingId,
        seller: minter,
        token: token.address,
        tokenId,
        price
      });

      return token.ownerOf(tokenId).then(owner => {
        assert.equal(owner, market.address, "Market contract is not the new owner."); 
      });
    });
  });

  const buyer = accounts[2];

  describe('Buy token', () => {
    before(async () => {
      market = await Market.new();
      token = await NFT.new();

      await token.mint({ from: minter });
      await token.approve(market.address, tokenId, {
        from: minter
      });

      await market.listToken(
        token.address,
        tokenId,
        price,
        { from: minter }
      );
    });
    
    it('should prevent sale - seller cannot be buyer', () => {
      return expectRevert(
        market.buyToken(listingId, { from: minter }),
        'Seller cannot be buyer'
      );
    });

    it('should prevent sale - insufficient payment', () => {
      return expectRevert(
        market.buyToken(listingId, {
          from: buyer,
          value: 1
        }),
        'Insufficient payment'
      );
    })

    it('should execute sale', async () => {
      const tx = await market.buyToken(listingId, {
        from: buyer,
        value: price
      });

      expectEvent(tx, 'Sale', {
        listingId,
        buyer,
        token: token.address,
        tokenId,
        price
      });

      return token.ownerOf(tokenId).then(owner => {
        assert.equal(owner, buyer, "Buyer is not the new owner."); 
      });
    })

    it('should prevent sale - listing is not active', () => {
      return expectRevert(
        market.buyToken(listingId, {
          from: buyer,
          value: price
        }),
        'Listing is not active'
      );
    });
  });

  describe('Cancel listing', () => {
    before(async () => {
      market = await Market.new();
      token = await NFT.new();

      await token.mint({ from: minter });
      await token.approve(market.address, tokenId, {
        from: minter
      });

      await market.listToken(
        token.address,
        tokenId,
        price,
        { from: minter }
      );
    });

    it('should prevent cancellation - only seller can cancel', () => {
      return expectRevert(
        market.cancel(listingId, { from: buyer }),
        'Only seller can cancel listing'
      );
    })

    it('should execute cancellation', async () => {
      const tx = await market.cancel(listingId, { from: minter });

      expectEvent(tx, 'Cancel', {
        listingId,
        seller: minter
      });
    })

    it('should prevent cancellation - listing is not active', () => {
      return expectRevert(
        market.cancel(listingId, { from: minter }),
        'Listing is not active'
      );
    })
  });
});
